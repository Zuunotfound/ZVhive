import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

const String apiBase = String.fromEnvironment('API_BASE', defaultValue: 'https://zvhive-bl7rhxlu9-ven-s-projects.vercel.app');

void main() {
  runApp(const ZVHiveApp());
}

class ZVHiveApp extends StatelessWidget {
  const ZVHiveApp({super.key});
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'ZVHive',
      theme: ThemeData(colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF0EA5E9)), useMaterial3: true),
      home: const RootTabs(),
    );
  }
}

class RootTabs extends StatefulWidget {
  const RootTabs({super.key});
  @override
  State<RootTabs> createState() => _RootTabsState();
}

class _RootTabsState extends State<RootTabs> {
  int idx = 0;
  final pages = const [HomeScreen(), ReaderScreen(), CommunityScreen(), ProfileScreen()];
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: pages[idx],
      bottomNavigationBar: NavigationBar(
        selectedIndex: idx,
        destinations: const [
          NavigationDestination(icon: Icon(Icons.home_outlined), label: 'Home'),
          NavigationDestination(icon: Icon(Icons.menu_book_outlined), label: 'Reader'),
          NavigationDestination(icon: Icon(Icons.forum_outlined), label: 'Community'),
          NavigationDestination(icon: Icon(Icons.person_outline), label: 'Profile'),
        ],
        onDestinationSelected: (i) => setState(() => idx = i),
      ),
    );
  }
}

Future<Map<String, dynamic>?> getJson(String path) async {
  final res = await http.get(Uri.parse('$apiBase$path'));
  if (res.statusCode >= 200 && res.statusCode < 300) {
    return json.decode(res.body) as Map<String, dynamic>;
  }
  return null;
}

Future<List<dynamic>> getList(String path) async {
  final res = await http.get(Uri.parse('$apiBase$path'));
  if (res.statusCode >= 200 && res.statusCode < 300) {
    return json.decode(res.body) as List<dynamic>;
  }
  return [];
}

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});
  @override
  Widget build(BuildContext context) {
    return FutureBuilder<Map<String, dynamic>?>(
      future: getJson('/health'),
      builder: (context, snap) {
        return Scaffold(
          appBar: AppBar(title: const Text('ZVHive')),
          body: Center(
            child: snap.connectionState != ConnectionState.done
                ? const CircularProgressIndicator()
                : Text('API: ${snap.data?['status'] ?? 'unknown'}'),
          ),
        );
      },
    );
  }
}

class ReaderScreen extends StatelessWidget {
  const ReaderScreen({super.key});
  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<dynamic>>(
      future: getList('/api/content/series'),
      builder: (context, snap) {
        if (snap.connectionState != ConnectionState.done) {
          return const Scaffold(body: Center(child: CircularProgressIndicator()));
        }
        final items = snap.data ?? [];
        return Scaffold(
          appBar: AppBar(title: const Text('Reader')),
          body: ListView.separated(
            itemCount: items.length,
            separatorBuilder: (_, __) => const Divider(height: 1),
            itemBuilder: (context, i) {
              final m = items[i] as Map<String, dynamic>;
              return ListTile(title: Text(m['title']?.toString() ?? '—'), subtitle: Text(m['kind']?.toString() ?? ''));
            },
          ),
        );
      },
    );
  }
}

class CommunityScreen extends StatelessWidget {
  const CommunityScreen({super.key});
  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<dynamic>>(
      future: getList('/api/community/posts'),
      builder: (context, snap) {
        if (snap.connectionState != ConnectionState.done) {
          return const Scaffold(body: Center(child: CircularProgressIndicator()));
        }
        final posts = snap.data ?? [];
        return Scaffold(
          appBar: AppBar(title: const Text('Community')),
          body: ListView.builder(
            itemCount: posts.length,
            itemBuilder: (context, i) {
              final p = posts[i] as Map<String, dynamic>;
              return ListTile(title: Text(p['title']?.toString() ?? ''), subtitle: Text(p['content']?.toString() ?? ''));
            },
          ),
        );
      },
    );
  }
}

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});
  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      appBar: AppBar(title: Text('Profile')),
      body: Center(child: Text('Login & profile editing (coming soon)')),
    );
  }
}

